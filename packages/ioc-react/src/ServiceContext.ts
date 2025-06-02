import { createContext } from 'react';
import { Container} from '@ivorobioff/ioc-container';

export const container = new Container();

export const ServiceContext = createContext(container);