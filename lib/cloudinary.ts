import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY_URL dans l'environnement configure automatiquement le SDK.
cloudinary.config({ secure: true });

export { cloudinary };
