document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const scheduleList = document.getElementById('schedules');

    // Carrega agendamentos do armazenamento local, se existirem
    let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

    // Função para renderizar a lista de agendamentos na página
    function renderSchedules() {
        scheduleList.innerHTML = '';
        schedules.forEach((schedule, index) => {
            const li = document.createElement('li');
            
            // Conteúdo do agendamento
            const detailsDiv = document.createElement('div');
            detailsDiv.innerHTML = `
                <strong>Cliente:</strong> ${schedule.clientName} <br>
                <strong>Telefone:</strong> ${schedule.phone} <br>
                <strong>Serviço:</strong> ${schedule.service} <br>
                <strong>Data:</strong> ${schedule.date} <br>
                <strong>Hora:</strong> ${schedule.time}
            `;
            li.appendChild(detailsDiv);

            // Botões de ação (WhatsApp e Excluir)
            const actionButtonsDiv = document.createElement('div');
            actionButtonsDiv.classList.add('action-buttons');

            // Botão de WhatsApp
            const whatsappLink = createWhatsAppLink(schedule);
            const whatsappButton = document.createElement('a');
            whatsappButton.href = whatsappLink;
            whatsappButton.target = '_blank';
            whatsappButton.classList.add('whatsapp-btn');
            whatsappButton.textContent = 'Enviar WhatsApp';
            actionButtonsDiv.appendChild(whatsappButton);

            // Botão de Excluir
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Excluir';
            deleteButton.dataset.index = index;
            actionButtonsDiv.appendChild(deleteButton);
            
            li.appendChild(actionButtonsDiv);
            scheduleList.appendChild(li);
        });
        setupDeleteButtons();
    }

    // Função para gerar o link de "Click to Chat" do WhatsApp
    function createWhatsAppLink(schedule) {
        const message = encodeURIComponent(
            `Olá, ${schedule.clientName}! Passando para confirmar seu agendamento para o serviço de ${schedule.service} no dia ${formatDate(schedule.date)} às ${schedule.time}. Aguardamos você!`
        );
        const phoneNumber = schedule.phone.replace(/[^0-9]/g, '');
        return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    }

    // Função para formatar a data (opcional, mas melhora a mensagem)
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // Adiciona um novo agendamento
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = document.getElementById('client-name').value;
        const phone = document.getElementById('client-phone').value;
        const service = document.getElementById('service-description').value;
        const date = document.getElementById('schedule-date').value;
        const time = document.getElementById('schedule-time').value;

        const newSchedule = { clientName, phone, service, date, time };
        schedules.push(newSchedule);
        localStorage.setItem('schedules', JSON.stringify(schedules));

        form.reset();
        renderSchedules();
    });

    // Configura os botões de exclusão
    function setupDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                schedules.splice(index, 1);
                localStorage.setItem('schedules', JSON.stringify(schedules));
                renderSchedules();
            });
        });
    }

    // Renderiza a lista inicial ao carregar a página
    renderSchedules();
});