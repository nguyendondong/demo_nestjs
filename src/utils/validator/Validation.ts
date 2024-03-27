import { i18nValidationMessage } from "nestjs-i18n";

export const ValidationMessage = {
  NOT_EMPTY() {
    return i18nValidationMessage("validation.NOT_EMPTY");
  },

  IS_STRING() {
    return i18nValidationMessage("validation.IS_STRING");
  },
  INVALID_EMAIL() {
    return i18nValidationMessage("validation.INVALID_EMAIL");
  },
};
