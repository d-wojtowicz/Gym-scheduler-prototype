function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('actualPageDate');
    window.location.href = '/';
}

function myAccount() {
    const token = localStorage.getItem('token');
    if (!token) {
        signOut();
    }

    window.location.href = '/user';
}

function myDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        signOut();
    }
    
    window.location.href = '/dashboard';
}