function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getPriority(taskIndex);
}