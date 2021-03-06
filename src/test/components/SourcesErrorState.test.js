import SourcesErrorState from '../../components/SourcesErrorState';

import { Button, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye, Title } from '@patternfly/react-core';

import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

import { componentWrapperIntl } from '../../utilities/testsHelpers';
import mockStore from '../__mocks__/mockStore';

describe('SourcesErrorState', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  it('renders correctly', () => {
    const wrapper = mount(componentWrapperIntl(<SourcesErrorState />, store));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
    expect(wrapper.find(ExclamationCircleIcon)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper.find(Button).text()).toEqual('Retry');
    expect(wrapper.find(Title)).toHaveLength(1);
    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find(EmptyState).props().className).toEqual('ins-c-sources__empty-state');
  });
});
