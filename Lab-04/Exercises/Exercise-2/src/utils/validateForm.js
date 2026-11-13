// Pure validation: same input always gives the same errors object.
// Called during render, so errors are never stale and need no effect hook.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Name is required.';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';

  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';

  // Cross-field rule: depends on two values, still derived in the same pass
  if (!values.confirm) errors.confirm = 'Please confirm your password.';
  else if (values.confirm !== values.password) errors.confirm = 'Passwords do not match.';

  return errors;
}
