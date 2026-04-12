// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock next/image to render a plain <img> in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));
