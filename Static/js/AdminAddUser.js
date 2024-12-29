//if role khác editor thì ẩn category
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".form-group").forEach((element) => {
        if (element.querySelector("select") && element.querySelector("select").id.includes("roleSelect")) {
            const categoryGroup = document.getElementById(`categoryGroup`);
            const roleSelect = document.getElementById(`roleSelect}`);

            // Kiểm tra giá trị ban đầu để ẩn/hiện categoryGroup
            if (roleSelect.value !== "Editor") {
                categoryGroup.style.display = "none";
            }

            // Gắn sự kiện change để xử lý thay đổi
            roleSelect.addEventListener("change", () => {
                if (roleSelect.value === "Editor") {
                    categoryGroup.style.display = "block";
                } else {
                    categoryGroup.style.display = "none";
                }
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các nút Add
    document.querySelectorAll(".actionBtn").forEach(button => {
        button.addEventListener("click", (event) => {
            // Lấy ID từ nút
            const id = event.target.id.replace("addBtn_", "");

            // Lấy giá trị được chọn từ <select>
            const selectElement = document.getElementById(`categorySelect`);
            const selectedValue = selectElement.value;
            const selectedText = selectElement.options[selectElement.selectedIndex].text;

            // Kiểm tra xem mục đã tồn tại chưa
            const resultContainer = document.getElementById(`categoryResult`);
            const existingItem = resultContainer.querySelector(`[data-value="${selectedValue}"]`);
            if (existingItem) {
                return;
            }

            // Tạo một mục mới
            const newItem = document.createElement("div");
            newItem.className = "categoryInputItem";
            newItem.setAttribute("data-value", selectedValue);
            newItem.innerHTML = `
                ${selectedText} 
                <span class="categoryInputItemRemove" onclick="removeCategoryItem(this)">×</span>
            `;

            // Thêm vào danh sách
            resultContainer.appendChild(newItem);

            // Tìm div có id hiddenCategoryid tham chiếu
            const resultHiddenContainer = document.getElementById(`hiddenCategory`);

            const existingHiddenItem = resultHiddenContainer.querySelector(`[value="${selectedValue}"]`);
            if (existingHiddenItem) {
                existingHiddenItem.name = "category_add";
                return;
            }
            // Tạo input ẩn để gửi dữ liệu
            const newHiddenInput = document.createElement("input");
            newHiddenInput.type="hidden";
            newHiddenInput.className = `form-control editorCat`;
            newHiddenInput.id = `hiddenInput${selectedValue}`;
            newHiddenInput.value = selectedValue;
            newHiddenInput.name = "category_add";
            newHiddenInput.readOnly = true;
            // Chèn input mới vào DOM ngay sau input tham chiếu
            resultHiddenContainer.appendChild(newHiddenInput);
        });
    });
});

// Hàm xóa mục
function removeCategoryItem(element) {
    // Lấy ID của phần tử categoryInputResult
    const id = element.closest(".categoryInputResult").id.replace("categoryResult", "");
    
    // Lấy giá trị cần xóa
    const valueToRemove = element.parentElement.getAttribute("data-value");
    
    // Xóa mục khỏi DOM
    element.parentElement.remove();
    
    // Tìm và thay đổi name các input ẩn có giá trị tương ứng trong hiddenCategory
    const hiddenInputs = document.getElementById(`hiddenInput${valueToRemove}`)
    hiddenInputs.name = "category_remove";
}
