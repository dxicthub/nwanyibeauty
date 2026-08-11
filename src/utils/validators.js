export const validators = {
  email: (value) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(value);
  },
  
  password: (value) => {
    return value.length >= 6;
  },
  
  phone: (value) => {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(value.replace(/\s/g, ''));
  },
  
  required: (value) => {
    return value && value.trim().length > 0;
  },
  
  minLength: (value, length) => {
    return value && value.length >= length;
  },
  
  maxLength: (value, length) => {
    return value && value.length <= length;
  },
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const { type, message, params } = rule;
      const value = data[field];
      
      let isValid = true;
      switch (type) {
        case 'required':
          isValid = validators.required(value);
          break;
        case 'email':
          isValid = validators.email(value);
          break;
        case 'password':
          isValid = validators.password(value);
          break;
        case 'phone':
          isValid = validators.phone(value);
          break;
        case 'minLength':
          isValid = validators.minLength(value, params);
          break;
        case 'maxLength':
          isValid = validators.maxLength(value, params);
          break;
        default:
          isValid = true;
      }
      
      if (!isValid) {
        errors[field] = message;
        break;
      }
    }
  }
  
  return errors;
};