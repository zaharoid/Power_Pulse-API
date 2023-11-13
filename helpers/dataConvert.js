function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export default formatDate;