// 1. Registro do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registado com sucesso! Escopo:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registar o Service Worker:', error);
      });
  });
}

// 2. Detecção de Status de Conectividade (Online/Offline)
const offlineAlert = document.getElementById('offline-alert');

function updateOnlineStatus() {
  if (navigator.onLine) {
    offlineAlert.style.display = 'none';
    console.log('Aplicação online.');
  } else {
    offlineAlert.style.display = 'block';
    console.log('Aplicação offline. Ativando cache adaptativo.');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// 3. Gestão e Solicitação de Permissões de Notificação Push
const btnNotification = document.getElementById('btn-notification');

btnNotification.addEventListener('click', () => {
  if (!('Notification' in window)) {
    alert('Este navegador não suporta notificações de desktop.');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Permissão para notificações concedida.');
      new Notification('EcoTech', {
        body: 'As notificações foram ativadas com sucesso!',
        icon: './icons/icon-192.png'
      });
    } else {
      console.log('Permissão para notificações negada.');
    }
  });
});