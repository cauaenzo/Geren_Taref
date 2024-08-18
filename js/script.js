document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('new-task-form');
    const taskInput = document.getElementById('task-input');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskList = document.getElementById('tasks');
    const batchActions = document.getElementById('batch-actions');
    const deleteSelectedButton = document.getElementById('delete-selected');
    const pinSelectedButton = document.getElementById('pin-selected');
    const unpinSelectedButton = document.getElementById('unpin-selected');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Cria um novo item de lista
        const taskText = taskInput.value;
        const taskDescription = taskDescriptionInput.value;
        if (taskText.trim() === '') return;

        const li = document.createElement('li');

        // Cria a caixa de seleção
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', updateBatchActionsVisibility);

        // Cria o título da tarefa
        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = taskText;

        // Cria a descrição da tarefa
        const descriptionSpan = document.createElement('span');
        descriptionSpan.className = 'task-description';
        descriptionSpan.textContent = taskDescription;

        // Cria o botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function() {
            li.remove();
            updateBatchActionsVisibility();
        });

        // Adiciona os elementos à lista
        li.appendChild(checkbox);
        li.appendChild(titleSpan);
        li.appendChild(descriptionSpan);
        li.appendChild(removeButton);
        taskList.appendChild(li);

        // Limpa os campos de entrada
        taskInput.value = '';
        taskDescriptionInput.value = '';

        // Adiciona evento para mostrar/ocultar a descrição
        titleSpan.addEventListener('click', function() {
            li.classList.toggle('show-description');
        });

        // Atualiza a visibilidade das ações em lote
        updateBatchActionsVisibility();
    });

    deleteSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            checkbox.closest('li').remove();
        });
        updateBatchActionsVisibility();
    });

    pinSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            li.classList.add('pinned');
        });
        updateBatchActionsVisibility();
    });

    unpinSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            li.classList.remove('pinned');
        });
        updateBatchActionsVisibility();
    });

    function updateBatchActionsVisibility() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        const hasPinned = Array.from(selectedCheckboxes).some(checkbox => checkbox.closest('li').classList.contains('pinned'));
        
        batchActions.classList.toggle('hidden', selectedCheckboxes.length === 0);
        unpinSelectedButton.classList.toggle('hidden', !hasPinned);
    }
});
