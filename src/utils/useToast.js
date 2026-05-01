import { ref } from "vue";

export const useToast = () => {
  const message = ref("");
  const variant = ref("info");
  const isVisible = ref(false);
  let timeoutId;

  const showToast = (text, nextVariant = "info", duration = 2400) => {
    message.value = text;
    variant.value = nextVariant;
    isVisible.value = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      isVisible.value = false;
    }, duration);
  };

  return {
    message,
    variant,
    isVisible,
    showToast,
  };
};
