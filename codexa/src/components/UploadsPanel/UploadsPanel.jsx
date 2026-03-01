import { Upload } from 'lucide-react'
import './UploadsPanel.css'

export function UploadsPanel({ uploadedImages, onUpload, onSelectImage, onClose, inline }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader()
            reader.onload = (event) => {
                onUpload(event.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className={`uploads-panel ${inline ? 'inline' : ''}`}>
            <div className="panel-header">
                <h3>Uploads</h3>
            </div>

            <div className="upload-actions">
                <label className="upload-pill">
                    <Upload size={16} />
                    <span>Upload</span>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        hidden
                    />
                </label>
            </div>

            <div className="uploads-gallery">
                {uploadedImages.length === 0 ? (
                    <div className="empty-uploads">
                        <p>Your Uploads</p>
                    </div>
                ) : (
                    <div className="image-grid">
                        {uploadedImages.map((img, index) => (
                            <div
                                key={index}
                                className="uploaded-image-item"
                                onClick={() => onSelectImage(img)}
                            >
                                <img src={img} alt={`Upload ${index}`} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
