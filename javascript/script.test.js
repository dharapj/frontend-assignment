import '@testing-library/jest-dom';
import { waitFor, fireEvent, screen } from '@testing-library/dom';
import fetchMock from 'jest-fetch-mock';
require('./script');

fetchMock.enableMocks();

document.body.innerHTML = `
  <div id="spinner" style="display: none;"></div>
  <div id="no-data" style="display: none;">No data available</div>
  <table id="table" style="display: none;">
    <thead>
      <tr>
        <th>S.No.</th>
        <th>Percentage Funded</th>
        <th>Amount Pledged</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  <div id="pagination" style="display: none;"></div>
`;

describe('script.js functionality', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should show spinner while fetching data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const spinner = document.getElementById('spinner');
    const noData = document.getElementById('no-data');
    const table = document.getElementById('table');
    expect(spinner.style.display).toBe('block');
    expect(noData.style.display).toBe('none');
    expect(table.style.display).toBe('none'); 
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  test('should display "No data available" when no data is fetched', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await screen.findByText('No data available');
    expect(screen.getByText('No data available')).toBeVisible();
    expect(document.getElementById('table').style.display).toBe('none');
  });

  test('should render table with fetched data', async () => {
    const mockData = [
      { 'percentage.funded': 75, 'amt.pledged': 1000 },
      { 'percentage.funded': 80, 'amt.pledged': 2000 },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
    expect(rows[1].cells[1]).toHaveTextContent('75%');
    expect(rows[1].cells[2]).toHaveTextContent('$1000');
  });

  test('should paginate data correctly', async () => {
    const mockData = Array.from({ length: 15 }, (_, i) => ({
      'percentage.funded': i * 10,
      'amt.pledged': i * 100,
    }));
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const rowsPage1 = await screen.findAllByRole('row');
    expect(rowsPage1[1].cells[1]).toHaveTextContent('0%');
    expect(rowsPage1[1].cells[2]).toHaveTextContent('$0');
    const nextButton = screen.getByText('Next >');
    fireEvent.click(nextButton);
    const rowsPage2 = await screen.findAllByRole('row');
    expect(rowsPage2[1].cells[1]).toHaveTextContent('50%');
    expect(rowsPage2[1].cells[2]).toHaveTextContent('$500');
  });
});
