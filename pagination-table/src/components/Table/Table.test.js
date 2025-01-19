import { render, screen, waitFor } from "@testing-library/react";
import Table from ".";
import { errorText, nextButton, prevButton, tableHeadingText } from "./constants";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});
const mockApiData = [
  {
    "s.no": 1,
    title: "title 1",
    "percentage.funded": "26",
    "amt.pledged": "5",
  },
  {
    "s.no": 2,
    title: "title 2",
    "percentage.funded": "20",
    "amt.pledged": "7",
  },
]
describe('Table Component', () => {
  test("renders loading spinner initially", () => {
    render(<Table />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  test("renders table data after successful API fetch", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockApiData),
    });

    render(<Table />);
    expect(screen.getByText(nextButton)).toBeInTheDocument()
    expect(screen.getByText(prevButton)).toBeInTheDocument()
    expect(screen.getByText(tableHeadingText)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("title 1")).toBeInTheDocument();
      expect(screen.getByText("26")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      expect(screen.getByText("title 2")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });

  test("handles API fetch failure", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    render(<Table />);
    await waitFor(() => {
      expect(screen.getByText(errorText)).toBeInTheDocument();
    });
  });
})

