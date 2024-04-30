function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('actualPageDate');
    window.location.href = '/';
}
