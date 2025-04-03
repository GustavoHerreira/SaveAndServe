import { getLoggedInUser, updateUserData, logout } from './utils/storageUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const logoutButton = document.getElementById('logoutButton');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    const userName = document.getElementById('userName');

    // Carregar dados do usuário
    const user = getLoggedInUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Preencher nome do usuário no menu
    userName.textContent = `${user.firstName} ${user.lastName}`;

    // Preencher formulário com dados existentes
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('street').value = user.address?.street || '';
    document.getElementById('number').value = user.address?.number || '';
    document.getElementById('complement').value = user.address?.complement || '';
    document.getElementById('neighborhood').value = user.address?.neighborhood || '';
    document.getElementById('city').value = user.address?.city || '';
    document.getElementById('state').value = user.address?.state || '';
    document.getElementById('zipCode').value = user.address?.zipCode || '';

    // Carregar avatar se existir
    if (user.avatar) {
        profileAvatar.src = user.avatar;
    }

    // Manipular upload de avatar
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatar = e.target.result;
                profileAvatar.src = avatar;
                user.avatar = avatar;
                updateUserData(user);
            };
            reader.readAsDataURL(file);
        }
    });

    // Validar e enviar formulário
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!profileForm.checkValidity()) {
            e.stopPropagation();
            profileForm.classList.add('was-validated');
            return;
        }

        // Coletar dados do formulário
        const updatedUser = {
            ...user,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: {
                street: document.getElementById('street').value,
                number: document.getElementById('number').value,
                complement: document.getElementById('complement').value,
                neighborhood: document.getElementById('neighborhood').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value
            }
        };

        // Verificar alteração de senha
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (currentPassword && newPassword && confirmPassword) {
            if (currentPassword !== user.password) {
                alert('Senha atual incorreta!');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('As novas senhas não coincidem!');
                return;
            }
            updatedUser.password = newPassword;
        }

        // Atualizar dados do usuário
        updateUserData(updatedUser);
        alert('Perfil atualizado com sucesso!');
        window.location.reload();
    });

    // Manipular logout
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.href = 'login.html';
    });
});