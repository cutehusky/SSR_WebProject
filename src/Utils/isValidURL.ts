// Hàm kiểm tra URL hợp lệ
export const isValidUrl = (url: string): boolean =>{
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}