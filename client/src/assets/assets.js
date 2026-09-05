import logo_icon from './logo_icon.svg';
import facebook_icon from './facebook_icon.svg';
import instagram_icon from './instagram_icon.svg';
import twitter_icon from './twitter_icon.svg';
import star_icon from './star_icon.svg';
import rating_star from './rating_star.svg';
import sample_img_1 from './sample_img_1.png';
import sample_img_2 from './sample_img_2.png';
import profile_img_1 from './profile_img_1.png';
import profile_img_2 from './profile_img_2.png';
import step_icon_1 from './step_icon_1.svg';
import step_icon_2 from './step_icon_2.svg';
import step_icon_3 from './step_icon_3.svg';
import email_icon from './email_icon.svg';
import lock_icon from './lock_icon.svg';
import cross_icon from './cross_icon.svg';
import star_group from './star_group.png';
import credit_star from './credit_star.svg';
import profile_icon from './profile_icon.png';
import razorpay_logo from './razorpay_logo.png';
import stripe_logo from './stripe_logo.png';

export const assets = {
    logo_icon,
    facebook_icon,
    instagram_icon,
    twitter_icon,
    star_icon,
    rating_star,
    sample_img_1,
    sample_img_2,
    email_icon,
    lock_icon,
    cross_icon,
    star_group,
    credit_star,
    profile_icon,
    razorpay_logo,
    stripe_logo
};

export const stylePresets = [
    { id: 'Realistic', name: 'Realistic', icon: '📸', desc: 'Photorealistic textures and lifelike lighting' },
    { id: 'Cinematic', name: 'Cinematic', icon: '🎬', desc: 'Dramatic depth of field & movie-grade grading' },
    { id: 'Anime', name: 'Anime', icon: '✨', desc: 'Crisp linework and vibrant studio colors' },
    { id: '3D Render', name: '3D Render', icon: '🧊', desc: 'Polished CGI materials with raytracing' },
    { id: 'Illustration', name: 'Illustration', icon: '🎨', desc: 'Editorial digital illustration & expressive details' },
    { id: 'Natural', name: 'Natural', icon: '🌿', desc: 'Organic balance and authentic composition' }
];

export const aspectRatioOptions = [
    { id: '1:1', label: '1:1 Square', icon: 'square' },
    { id: '16:9', label: '16:9 Landscape', icon: 'landscape' },
    { id: '9:16', label: '9:16 Portrait', icon: 'portrait' },
    { id: '4:3', label: '4:3 Classic', icon: 'classic' }
];

export const stepsData = [
    {
        title: 'Precision Prompting',
        description: 'Describe your exact subject, environment, lighting, and composition with high fidelity.',
        icon: step_icon_1,
    },
    {
        title: 'Semantic Forge Engine',
        description: 'Our conservative adherence model extracts core subjects and eliminates artifacts.',
        icon: step_icon_2,
    },
    {
        title: 'Instant High-Res Export',
        description: 'Inspect, download in lossless PNG, favorite, or manage in your private personal gallery.',
        icon: step_icon_3,
    },
];

export const testimonialsData = [
    {
        image: profile_img_1,
        name: 'Alexander Chen',
        role: 'Senior Product Designer',
        stars: 5,
        text: `VisionForge AI actually sticks to the requested composition without inventing random subjects. The prompt adherence is easily the best I've worked with.`
    },
    {
        image: profile_img_2,
        name: 'Elena Rostova',
        role: 'Creative Director',
        stars: 5,
        text: `The 50 free credits on sign up gave our team plenty of room to test styles. The negative prompt controls make rendering character art super reliable.`
    },
    {
        image: profile_img_1,
        name: 'Marcus Vance',
        role: 'Indie Game Developer',
        stars: 5,
        text: `Fast generation, zero clutter, and clean gallery management. VisionForge AI has sped up our concept art pipeline by 10x.`
    },
];

export const plans = [
    {
        id: 'Free Starter',
        price: 0,
        credits: 50,
        desc: 'Included automatically on every new account.',
        isFree: true,
        features: [
            '50 Free Generations',
            'Full Prompt Adherence Engine',
            'Negative Prompt Controls',
            'Personal Private Gallery',
            'Standard Resolution PNG'
        ]
    },
    {
        id: 'Basic',
        price: 10,
        credits: 100,
        desc: 'Great for hobbyists & personal projects.',
        popular: false,
        features: [
            '100 Additional Credits',
            'All Style Presets & Aspect Ratios',
            'Priority Queue Processing',
            'Full Commercial License',
            'Unlimited Gallery Storage'
        ]
    },
    {
        id: 'Advanced',
        price: 50,
        credits: 500,
        desc: 'Ideal for creators & freelance professionals.',
        popular: true,
        features: [
            '500 High-Capacity Credits',
            'Maximum Prompt Adherence Precision',
            'Instant Parallel Generations',
            'Priority 24/7 Support',
            'Lossless Export Quality'
        ]
    },
    {
        id: 'Business',
        price: 250,
        credits: 5000,
        desc: 'Built for enterprise teams & design agencies.',
        popular: false,
        features: [
            '5,000 Volume Credits',
            'Dedicated Generation Compute',
            'Bulk Generation Tools',
            'Custom Workflow Integration',
            'VIP Engineering Support'
        ]
    },
];