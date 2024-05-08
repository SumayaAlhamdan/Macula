import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// setupTests.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });