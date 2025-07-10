import { createClient } from '@supabase/supabase-js';
import config from '../config';
import { storageService } from './storageService';

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

class AuthService {
  constructor() {
    this.currentUser = null;
    this.session = null;
  }

  // Initialize auth and check for existing session
  async initialize() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        this.session = session;
        this.currentUser = session.user;
        console.log('✅ User session restored:', session.user.email);
        return { success: true, user: session.user };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            gardening_experience: userData.experience || 'beginner',
            preferred_zone: userData.zone || '',
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await this.createUserProfile(data.user.id, {
          email: data.user.email,
          ...userData
        });

        console.log('✅ User signed up successfully:', data.user.email);
        return { 
          success: true, 
          user: data.user,
          message: 'Please check your email to verify your account.'
        };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      this.session = data.session;
      this.currentUser = data.user;

      // Sync local data with cloud
      await this.syncUserData();

      console.log('✅ User signed in:', data.user.email);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      this.session = null;
      this.currentUser = null;

      console.log('✅ User signed out');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'gogarden://reset-password',
      });

      if (error) throw error;

      console.log('✅ Password reset email sent');
      return { 
        success: true, 
        message: 'Check your email for password reset instructions.'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      console.log('✅ Password updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Create user profile in database
  async createUserProfile(userId, profileData) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: profileData.email,
          full_name: profileData.fullName || '',
          gardening_experience: profileData.experience || 'beginner',
          preferred_zone: profileData.zone || '',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log('✅ User profile created');
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', this.currentUser.id);

      if (error) throw error;

      console.log('✅ User profile updated');
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .single();

      if (error) throw error;

      return { success: true, profile: data };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Save garden to cloud
  async saveGardenToCloud(gardenData) {
    try {
      if (!this.currentUser) {
        console.log('No user logged in, saving locally only');
        return { success: true, local: true };
      }

      const { error } = await supabase
        .from('user_gardens')
        .upsert({
          user_id: this.currentUser.id,
          garden_data: gardenData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log('✅ Garden saved to cloud');
      return { success: true };
    } catch (error) {
      console.error('Error saving garden to cloud:', error);
      return { success: false, error: error.message };
    }
  }

  // Load garden from cloud
  async loadGardenFromCloud() {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      const { data, error } = await supabase
        .from('user_gardens')
        .select('garden_data')
        .eq('user_id', this.currentUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No garden data found
          return { success: true, gardenData: [] };
        }
        throw error;
      }

      return { success: true, gardenData: data.garden_data || [] };
    } catch (error) {
      console.error('Error loading garden from cloud:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync local data with cloud
  async syncUserData() {
    try {
      if (!this.currentUser) return;

      // Load local data
      const localGarden = await storageService.loadMyGarden();
      
      // Load cloud data
      const { success, gardenData: cloudGarden } = await this.loadGardenFromCloud();
      
      if (success) {
        // Merge data (prefer cloud data for existing plants)
        const mergedGarden = this.mergeGardenData(localGarden, cloudGarden);
        
        // Save merged data
        await storageService.saveMyGarden(mergedGarden);
        await this.saveGardenToCloud(mergedGarden);
        
        console.log('✅ Data synced successfully');
        return { success: true, garden: mergedGarden };
      }
      
      // If no cloud data, upload local data
      await this.saveGardenToCloud(localGarden);
      return { success: true, garden: localGarden };
    } catch (error) {
      console.error('Error syncing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Merge garden data (used for sync)
  mergeGardenData(localGarden, cloudGarden) {
    const merged = [...cloudGarden];
    const cloudIds = new Set(cloudGarden.map(p => p.id));
    
    // Add local plants that aren't in cloud
    localGarden.forEach(plant => {
      if (!cloudIds.has(plant.id)) {
        merged.push(plant);
      }
    });
    
    return merged;
  }

  // Setup auth state listener
  setupAuthListener(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        this.session = session;
        this.currentUser = session?.user || null;
        this.syncUserData();
      } else if (event === 'SIGNED_OUT') {
        this.session = null;
        this.currentUser = null;
      }
      
      callback(event, session);
    });
    
    return subscription;
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export auth states
export const AUTH_STATES = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  USER_UPDATED: 'USER_UPDATED',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
};