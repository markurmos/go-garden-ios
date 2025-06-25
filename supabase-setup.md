# Supabase Setup Guide for Go Garden

## 1. Create Storage Bucket

Go to your Supabase dashboard: https://supabase.com/dashboard/project/ajktssbhxnukxksjjdyr

### Storage Setup:
1. Navigate to **Storage** in the left sidebar
2. Create a new bucket called `plant-images`
3. Make it **public** so images can be accessed directly
4. Set up the bucket policy for public read access

### SQL to run in SQL Editor:
```sql
-- Update existing bucket to be public (if not already)
UPDATE storage.buckets SET public = true WHERE id = 'plant-images';

-- Allow public read access to plant images (run this if policy doesn't exist)
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'plant-images');
```

**Note**: If you get a policy already exists error, that's fine - it means access is already configured.

## 2. Upload Plant Images

You need to upload these specific image files to the `plant-images` bucket:

### Required Images:
- `lettuce.jpg`
- `spinach.jpg` 
- `kale.jpg`
- `arugula.jpg`
- `swiss-chard.jpg`
- `carrots.jpg`
- `radishes.jpg`
- `beets.jpg`
- `turnips.jpg`
- `tomatoes.jpg`
- `peppers.jpg`
- `zucchini.jpg`
- `cucumber.jpg`
- `eggplant.jpg`
- `basil.jpg`
- `cilantro.jpg`
- `parsley.jpg`
- `rosemary.jpg`
- `broccoli.jpg`
- `cauliflower.jpg`
- `cabbage.jpg`
- `green-beans.jpg`
- `peas.jpg`
- `onions.jpg`
- `green-onions.jpg`

### Image Requirements:
- Format: JPG or PNG
- Size: 400x300px (will be resized if needed)
- Good quality photos showing the actual plant/vegetable
- Consistent lighting and background when possible

## 3. Create Plants Table

```sql
-- Create plants table
CREATE TABLE plants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT NOT NULL,
  days_to_harvest INTEGER,
  water_needs TEXT,
  spacing INTEGER,
  season TEXT,
  zones TEXT[],
  image_url TEXT,
  description TEXT,
  planting_instructions TEXT,
  care_instructions TEXT,
  harvest_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert sample data
INSERT INTO plants (name, category, days_to_harvest, water_needs, spacing, season, zones, image_url) VALUES
('Lettuce', 'leafy', 45, 'high', 6, 'cool', ARRAY['3a','11b'], 'https://ajktssbhxnukxksjjdyr.supabase.co/storage/v1/object/public/plant-images/lettuce.jpg'),
('Spinach', 'leafy', 40, 'moderate', 4, 'cool', ARRAY['3a','9b'], 'https://ajktssbhxnukxksjjdyr.supabase.co/storage/v1/object/public/plant-images/spinach.jpg'),
('Kale', 'leafy', 55, 'moderate', 12, 'cool', ARRAY['3a','11b'], 'https://ajktssbhxnukxksjjdyr.supabase.co/storage/v1/object/public/plant-images/kale.jpg');
```

## 4. Update App Configuration

The app has been updated to use Supabase Storage URLs as the primary image source with fallbacks:

```javascript
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/plant-images`;
```

Each plant now tries:
1. Supabase Storage image first
2. High-quality Unsplash fallback
3. Pexels/other CDN fallback

## 5. Test the Setup

After uploading images:
1. Restart the React Native app
2. Check the console logs for image loading status
3. Verify images display correctly in the app
4. Test that fallbacks work if Supabase images fail

## Benefits of This Setup:

1. **Controlled Images**: You upload exactly the right images for each plant
2. **Fast Loading**: Images served from Supabase CDN
3. **Fallback System**: App still works if some images fail
4. **Consistent Quality**: All images can be optimized and standardized
5. **Easy Management**: Update images through Supabase dashboard