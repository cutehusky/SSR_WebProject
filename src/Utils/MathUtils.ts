export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export const getPagingNumber = (
    page: number,
    totalPages: number,
    maxDisplayPages = 5
) => {
    let startPage = Math.max(1, page - Math.floor(maxDisplayPages / 2));
    let endPage = Math.min(totalPages, page + Math.floor(maxDisplayPages / 2));
    if (endPage - startPage + 1 < maxDisplayPages) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxDisplayPages + 1);
        }
    }
    const pageNumbers: Array<{
        value: number;
        isActive: boolean;
        link?: string;
    }> = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push({ value: i, isActive: i === page });
    }
    return pageNumbers;
};

export function formatDateDifference(date1: Date, date2: Date): string {
    const diff = date2.getTime() - date1.getTime(); // Difference in milliseconds

    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Days
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
    const seconds = Math.floor((diff % (1000 * 60)) / 1000); // Seconds

    // Format as dd hh:mm:ss
    return `${days.toString().padStart(2, '0')} ngày ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
