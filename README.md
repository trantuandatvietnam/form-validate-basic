### Trải nghiệm người dùng khi sử dụng form

- Tránh trường hợp khi người dùng đang gõ vào ô input thì lại validate
- Nên thực hiện validate khi người dùng blur ra khỏi form
- Khi người dùng đang nhập thì clear lỗi đi không được hiển thị lỗi khi người dùng đang gõ vào ô input

### Viết code hướng thư viện

- Sau khi viết thì có thể sử dụng trong hầu hết các form, chỉ cần sửa một vài thứ là có thể sử dụng như bình thường

### Chú ý

- NodeList thì không thể sử dụng các method như reduce, map, ...giống như array, để chuyển dạng NodeList thành dạng Array thì sử dụng `Array.from()`

- Trong phép gán nó sẽ trả ra giá trị của biểu thức bên phía tay phải: VD: console.log(a = 19) // 19
