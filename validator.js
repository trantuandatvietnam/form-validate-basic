function Validator(option) {
  function getParentEl(element, selector) {
    const parent = element.closest(selector);
    return parent;
  }
  // object lưu toàn bộ rule của tất các fields
  var selectorRules = {};
  // Hàm thực hiện validate
  function validate(inputElement, errorElement, rule) {
    var errorMessage;
    // Lấy ra các rule của ô input vừa blur
    const rules = selectorRules[rule.selector];
    // Lặp qua từng rule và kiểm tra, nếu có lỗi thì dừng kiểm tra
    for (var inputRule of rules) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox": {
          errorMessage = inputRule(
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        }
        default:
          errorMessage = inputRule(inputElement.value);
      }
      if (errorMessage) break;
    }
    if (!errorMessage) {
      errorElement.innerText = "";
      getParentEl(inputElement, option.formGroupSelector).classList.remove(
        "invalid"
      );
      return true;
    }
    errorElement.innerText = errorMessage;
    getParentEl(inputElement, option.formGroupSelector).classList.add(
      "invalid"
    );
    return false;
  }

  // Lấy element form vần validate
  var formElement = document.querySelector(option.form);
  if (!formElement) return;
  // validate từng field có rule khi submit form
  formElement.onsubmit = function (e) {
    var isFormValid = true;
    e.preventDefault();
    // Thực hiện lặp qua từng rule và validate
    option.rules.forEach((rule) => {
      var inputElement = formElement.querySelector(rule.selector);
      var errorElement = getParentEl(
        inputElement,
        option.formGroupSelector
      ).querySelector(option.errorSelector);
      var isValid = validate(inputElement, errorElement, rule);
      if (!isValid) {
        isFormValid = false;
      }
    });
    // Lấy ra toàn bộ input có attribute là name và không có attribute là disabled (Dạng NodeList)
    var enableInputs = formElement.querySelectorAll("[name]:not([disabled])");
    // Chuyển NodeList về dạng Array
    if (!isFormValid) return;
    // Trường hợp submit với javascript
    if (typeof option.onSubmit === "function") {
      var formValues = Array.from(enableInputs).reduce((values, input) => {
        switch (input.type) {
          case "checkbox": {
            if (input.checked) {
              values[input.name] = Array.isArray(values[input.name])
                ? [...values[input.name], input.value]
                : [input.value];
            } else {
              values[input.name] = Array.isArray(values[input.name])
                ? [...values[input.name]]
                : [];
            }
            break;
          }
          case "radio": {
            input.checked && (values[input.name] = input.value);
            break;
          }
          case "file": {
            values[input.name] = input.files;
            break;
          }
          default:
            values[input.name] = input.value;
        }
        return values;
      }, {});
      option.onSubmit(formValues);
      // Trường hợp submit với hành vi mặc định
    } else {
      formElement.submit();
    }
  };
  // Lặp qua từng rule và xử lý (Lắng nghe sự kiện)
  option.rules.forEach((rule) => {
    // Lưu lại các rules cho mỗi input
    if (Array.isArray(selectorRules[rule.selector])) {
      selectorRules[rule.selector].push(rule.test);
    } else {
      selectorRules[rule.selector] = [rule.test];
    }
    var inputElements = formElement.querySelectorAll(rule.selector);
    Array.from(inputElements).forEach((inputElement) => {
      var errorElement = getParentEl(
        inputElement,
        option.formGroupSelector
      ).querySelector(option.errorSelector);
      // Xử lý trường hợp khi người dùng blur ra ngoài
      inputElement.onblur = function () {
        validate(inputElement, errorElement, rule);
      };
      // Xử lí khi người dùng nhập vào input
      inputElement.oninput = function () {
        errorElement.innerText = "";
        getParentEl(inputElement, option.formGroupSelector).classList.remove(
          "invalid"
        );
      };
    });
  });
}

// DEFINE RULES
// Nguyên tắc của các rules
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra gì cả (undefined)

Validator.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      if (typeof value === "string") {
        return value?.trim()
          ? undefined
          : message || "Vui lòng nhập trường này!";
      }
      return value ? undefined : message || "Vui lòng nhập trường này!";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector,
    test: function (value) {
      return value?.trim().length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự!`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
