export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export const getPagingNumber = (page: number, totalPages: number, maxDisplayPages = 5) => {
    let startPage = Math.max(
        1,
        page - Math.floor(maxDisplayPages / 2)
    );
    let endPage = Math.min(totalPages, page + Math.floor(maxDisplayPages / 2));
    if (endPage - startPage + 1 < maxDisplayPages) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxDisplayPages + 1);
        }
    }
    const pageNumbers: Array<{value: number, isActive: boolean, link?: string}> = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push({value: i, isActive: i === page});
    }
    return pageNumbers;
}