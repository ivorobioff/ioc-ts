import { useContext } from 'react';
import { ServiceContext } from './ServiceContext';
import { InstanceReference } from '@ivorobioff/ioc-container';

export default function useService<T>(reference: InstanceReference<T>): T {
  const serviceLocator = useContext(ServiceContext);
  return serviceLocator.get(reference);
}