import { create } from 'zustand';

const useOnboardingStore = create((set) => ({
  currentStep: 1,
  isSubmitting: false,
  answers: {
    duration: null,
    companion: null,
    budget: null,
    pacing: null,
    exploration: null,
    energy: null,
    physical: null,
    taste: [],
    styles: [],
  },

  // Set một giá trị đơn (ví dụ: duration, companion)
  setAnswer: (key, value) => 
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),

  // Toggle giá trị cho mảng (ví dụ: taste, styles)
  toggleArrayAnswer: (key, value) =>
    set((state) => {
      const currentArray = state.answers[key] || [];
      const hasValue = currentArray.includes(value);
      
      let newArray;
      if (hasValue) {
        newArray = currentArray.filter(v => v !== value);
      } else {
        // Giới hạn chọn tối đa 3
        if (currentArray.length >= 3) {
          return state; // Không thay đổi nếu đã đủ 3
        }
        newArray = [...currentArray, value];
      }
      return { answers: { ...state.answers, [key]: newArray } };
    }),

  nextStep: () => 
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 11), // Tối đa 11 bước (10: thinking, 11: result)
    })),

  prevStep: () => 
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  reset: () => set({
    currentStep: 1,
    isSubmitting: false,
    answers: {
      duration: null,
      companion: null,
      budget: null,
      pacing: null,
      exploration: null,
      energy: null,
      physical: null,
      taste: [],
      styles: [],
    }
  }),
}));

export default useOnboardingStore;
