import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import { Container } from '@ivorobioff/ioc-container';
import { ServiceContext, useService } from '../src';

function MyText() {
  const text = useService('my-text');
  return <>{text}</>;
}

describe('useService', () => {

  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('renders the text provided by the useService hook ', () => {

    container.registerInstance('my-text', 'apple is not pear');

    render(<ServiceContext.Provider value={container}><MyText /></ServiceContext.Provider>);

    expect(screen.getByText('apple is not pear')).toBeTruthy();
  });
});