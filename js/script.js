document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('new-task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('tasks');
    const batchActions = document.getElementById('batch-actions');
    const deleteSelectedButton = document.getElementById('delete-selected');
    const pinSelectedButton = document.getElementById('pin-selected');
    const unpinSelectedButton = document.getElementById('unpin-selected');
    const tipsModal = document.getElementById('tips-modal');
    const tipsButton = document.getElementById('tips-button');
    const closeButton = document.querySelector('.close-tips');
    const slides = document.querySelectorAll('.tips-slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slide-dots');
    
    let originalPositions = new Map();
    let taskCounter = 0;
    let currentSlide = 0;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const taskText = taskInput.value;
        if (taskText.trim() === '') return;

        createTask(taskText);
        taskInput.value = '';
        updateBatchActionsVisibility();
    });

    function createTask(taskText) {
        const li = document.createElement('li');
        taskCounter++;
        li.dataset.taskId = taskCounter;
        li.dataset.originalPosition = taskCounter;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', updateBatchActionsVisibility);

        const span = document.createElement('span');
        span.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.setAttribute('aria-label', 'Remover tarefa');
        removeButton.addEventListener('click', function() {
            li.remove();
            originalPositions.delete(li.dataset.taskId);
            updateBatchActionsVisibility();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(removeButton);
        taskList.appendChild(li);
    }

    pinSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            if (!li.classList.contains('pinned')) {
                // Guarda a posição original antes de fixar
                originalPositions.set(li.dataset.taskId, li.dataset.originalPosition);
                li.classList.add('pinned');
                // Move para o início da lista
                taskList.insertBefore(li, taskList.firstChild);
            }
            checkbox.checked = false;
        });
        updateBatchActionsVisibility();
    });

    unpinSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            if (li.classList.contains('pinned')) {
                li.classList.remove('pinned');
                // Recupera e remove a posição original
                const originalPos = originalPositions.get(li.dataset.taskId);
                originalPositions.delete(li.dataset.taskId);
                
                // Encontra a posição correta para inserir o elemento
                const items = Array.from(taskList.children);
                let insertBefore = null;
                
                for (let item of items) {
                    if (!item.classList.contains('pinned') && 
                        Number(item.dataset.originalPosition) > Number(originalPos)) {
                        insertBefore = item;
                        break;
                    }
                }
                
                if (insertBefore) {
                    taskList.insertBefore(li, insertBefore);
                } else {
                    taskList.appendChild(li);
                }
            }
            checkbox.checked = false;
        });
        updateBatchActionsVisibility();
    });

    deleteSelectedButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            originalPositions.delete(li.dataset.taskId);
            li.remove();
        });
        updateBatchActionsVisibility();
    });

    function updateBatchActionsVisibility() {
        const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        const hasPinned = Array.from(selectedCheckboxes).some(checkbox => 
            checkbox.closest('li').classList.contains('pinned'));
        
        batchActions.classList.toggle('hidden', selectedCheckboxes.length === 0);
        pinSelectedButton.classList.toggle('hidden', selectedCheckboxes.length === 0);
        unpinSelectedButton.classList.toggle('hidden', !hasPinned);
    }

    // Criar pontos indicadores
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Mostrar primeiro slide
    slides[0].classList.add('active');

    // Abrir modal
    tipsButton.addEventListener('click', () => {
        tipsModal.style.display = 'flex';
    });

    // Fechar modal
    closeButton.addEventListener('click', () => {
        tipsModal.style.display = 'none';
    });

    // Fechar ao clicar fora do modal
    tipsModal.addEventListener('click', (e) => {
        if (e.target === tipsModal) {
            tipsModal.style.display = 'none';
        }
    });

    // Navegação dos slides
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.dot')[currentSlide].classList.add('active');
    }

    // Adicionar navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (tipsModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
            if (e.key === 'Escape') tipsModal.style.display = 'none';
        }
    });
});
