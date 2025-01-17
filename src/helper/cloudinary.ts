import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: 'be-fresh-ltd', 
    api_key: '128215362951182', 
    api_secret: 'WbNw7UjHKSAm3axm7bJCCnAhSr8', // Click 'View API Keys' above to copy your API secret
});




const deleteFromCloudinary = async (public_ids: string | string[], type: 'single' | 'multiple'): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            if (type === 'single') {
                // Ensure public_ids is a string for single deletion
                if (typeof public_ids !== 'string') {
                    return reject(new Error('For single deletion, public_ids must be a string.'));
                }

                const extractPublicId = (public_ids:string) => {
                    const matches = public_ids.match(/\/([^/]+)\.[^.]+$/);
                    return matches ? matches[1] : null; // Extracts the public_id without extension
                };

                const extractedId = extractPublicId(public_ids);
               
                // For single file delete
                cloudinary.uploader.destroy(extractedId as string, (error, result) => {
                    if (error) {
                        return reject(error); // Reject the promise on error
                    }
                    
                    resolve(result); // Resolve the promise with the result
                });
            } else if (type === 'multiple') {
                // Ensure public_ids is an array for multiple deletion
                if (!Array.isArray(public_ids)) {
                    return reject(new Error('For multiple deletion, public_ids must be an array of strings.'));
                }

                // For multiple file delete
                cloudinary.api.delete_resources(public_ids, (error, result) => {
                    if (error) {
                        return reject(error); // Reject the promise on error
                    }
                    
                    resolve(result); // Resolve the promise with the result
                });
            } else {
                return reject(new Error('Invalid type specified. Use "single" or "multiple".'));
            }
        } catch (err) {
            reject(err); // Catch any synchronous errors and reject the promise
        }
    });
};



export const FileUploadCloudinary = {
    deleteFromCloudinary,
}