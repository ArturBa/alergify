export const AllergensControllerMock = jest.fn(() => {
  return {
    allergensService: jest.fn() as any,
    foodLogService: jest.fn() as any,
    symptomLogService: jest.fn() as any,
    productService: jest.fn() as any,

    getAllergens: jest.fn(),
    setAllergen: jest.fn(),
    unsetAllergen: jest.fn(),
    addFoodLogAllergens: jest.fn(),
    removeFoodLogAllergens: jest.fn(),
    diffFoodLogAllergens: jest.fn(),
    addSymptomLogAllergens: jest.fn(),
    removeSymptomLogAllergens: jest.fn(),
    diffSymptomLogAllergens: jest.fn(),
    addAllergens: jest.fn(),
    removeAllergens: jest.fn(),
    getPoints: jest.fn(),
    getFoodLogPreviousDay: jest.fn(),
    getIngredientIds: jest.fn(),
    getSymptomNextDay: jest.fn(),
  };
});

export function getAllergensControllerMock() {
  const controller = {
    addFoodLogAllergens: jest.fn(),
    removeFoodLogAllergens: jest.fn(),
    diffFoodLogAllergens: jest.fn(),
    addSymptomLogAllergens: jest.fn(),
    removeSymptomLogAllergens: jest.fn(),
    diffSymptomLogAllergens: jest.fn(),
  };

  return controller as any;
}
