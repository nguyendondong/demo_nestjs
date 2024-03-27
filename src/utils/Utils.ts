import { I18nContext } from "nestjs-i18n";

const Utils = {
  t(key: any, args?: Record<string, unknown>): string {
    return I18nContext.current().translate(key, {
      lang: I18nContext.current().lang,
      args,
    });
  },
};

export default Utils;
