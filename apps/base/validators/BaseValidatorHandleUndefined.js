const BaseValidatorHandleUndefined = (data, key) => {
    if (!data) {
      throw new Error(
        `Tidak dapat diproses karena ${key || "ada nilai yang"} tidak valid.`
      );
    }
  };
  
  module.exports = BaseValidatorHandleUndefined;
  