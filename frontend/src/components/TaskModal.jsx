import TaskModalHeader from './TaskModalHeader';
import TaskModalMainContent from './TaskModalMainContent';
import TaskModalSidebar from './TaskModalSidebar';

export default function TaskModal({
  modalState,
  closeModal,
  onBackdropClick,
  addTask,
  saveJiraChanges,
  editTitle,
  editDescription,
  commentText,
  editAttachments,
  editComments,
  editPriority,
  editTag,
  editDueDate,
  setEditTitle,
  setEditDescription,
  setEditPriority,
  setEditTag,
  setEditDueDate,
  setEditAttachments,
  setCommentText,
  addCommentToModal,
  renderDescriptionLinks,
  handleFileChange,
  tagOptions,
}) {
  return (
    <div className="jira-overlay-backdrop" onClick={onBackdropClick}>
      <div className="jira-modal-window" onClick={(e) => e.stopPropagation()}>
        <TaskModalHeader
          modalState={modalState}
          addTask={addTask}
          saveJiraChanges={saveJiraChanges}
          closeModal={closeModal}
        />

        <div className="jira-modal-body-layout">
          <TaskModalMainContent
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            renderDescriptionLinks={renderDescriptionLinks}
            editAttachments={editAttachments}
            handleFileChange={handleFileChange}
            setEditAttachments={setEditAttachments}
            commentText={commentText}
            setCommentText={setCommentText}
            addCommentToModal={addCommentToModal}
            editComments={editComments}
          />

          <TaskModalSidebar
            modalState={modalState}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            editTag={editTag}
            setEditTag={setEditTag}
            editDueDate={editDueDate}
            setEditDueDate={setEditDueDate}
            tagOptions={tagOptions}
          />
        </div>
      </div>
    </div>
  );
}
