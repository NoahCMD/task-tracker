export default function TaskModalMainContent({
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  renderDescriptionLinks,
  editAttachments,
  handleFileChange,
  setEditAttachments,
  commentText,
  setCommentText,
  addCommentToModal,
  editComments,
}) {
  return (
    <div className="jira-modal-main-content">
      <div className="jira-editable-group">
        <label className="jira-modal-label">Summary</label>
        <input
          type="text"
          className="jira-modal-title-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
      </div>

      <div className="jira-editable-group">
        <label className="jira-modal-label">Description</label>
        <textarea
          className="jira-modal-description-textarea"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Provide deep details or attach operational context links..."
        />
        {editDescription && (
          <div className="jira-rendered-links-preview">
            <span className="preview-mini-title">Rendered Links Preview:</span>
            <p>{renderDescriptionLinks(editDescription)}</p>
          </div>
        )}
      </div>

      <div className="jira-editable-group">
        <label className="jira-modal-label">Attachments & Media Assets</label>
        <div className="form-file-row modal-file-row">
          <label className="file-upload-btn">
            📎 Upload Asset Files
            <input type="file" multiple onChange={handleFileChange} accept="image/*,video/*,application/pdf" />
          </label>
          {editAttachments.length > 0 && (
            <button className="clear-files-btn" onClick={() => setEditAttachments([])}>Flush All Files</button>
          )}
        </div>

        {editAttachments.length > 0 ? (
          <div className="jira-modal-attachments-grid">
            {editAttachments.map((file, idx) => (
              <div key={idx} className="jira-attachment-tile">
                {file.type.startsWith('image/') ? (
                  <a href={file.data} target="_blank" rel="noopener noreferrer">
                    <img src={file.data} alt={file.name} className="jira-tile-media" />
                  </a>
                ) : file.type.startsWith('video/') ? (
                  <video src={file.data} controls className="jira-tile-media" />
                ) : (
                  <a href={file.data} download={file.name} className="jira-tile-fallback">
                    📄 {file.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="jira-empty-media-placeholder">No assets loaded onto task container.</div>
        )}
      </div>

      <div className="jira-editable-group">
        <label className="jira-modal-label">Comments</label>
        <textarea
          className="jira-modal-description-textarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a progress update note..."
        />
        <button type="button" className="jira-btn-add-comment" onClick={addCommentToModal}>Add Comment</button>

        {editComments.length > 0 ? (
          <div className="comment-timeline">
            {editComments.map((comment, idx) => (
              <div key={idx} className="timeline-item">
                <span className="timeline-time">{new Date(comment.timestamp).toLocaleString()}</span>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="jira-empty-media-placeholder">No comments yet.</div>
        )}
      </div>
    </div>
  );
}
