export const getContextDate = (inputDate: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDateOnly = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
    );

    if (inputDateOnly.getTime() === today.getTime()) {
        return "Today";
    } else if (inputDateOnly.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else {
        let dateParts = inputDate.toDateString().split(' ');
        dateParts.shift();
        return dateParts.join(' ');
    }
};