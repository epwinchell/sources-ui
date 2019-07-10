import React from 'react';
import {
    Bullseye,
    Card,
    CardBody,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

import { WrenchIcon } from '@patternfly/react-icons'; // FIXME: different icon
import { Link } from 'react-router-dom';
import { paths } from '../Routes';

const SourcesEmptyState = () => (
    <Card>
        <CardBody>
            <Bullseye>
                <EmptyState>
                    <EmptyStateIcon icon={WrenchIcon} />
                    <Title headingLevel="h5" size="lg">
                        <FormattedMessage
                            id="sources.emptyStateTitle"
                            defaultMessage="No Sources"
                        />
                    </Title>
                    <EmptyStateBody>
                        <FormattedMessage
                            id="sources.emptyStateBody"
                            defaultMessage="No Sources have been defined. To start define a Source."
                        />
                    </EmptyStateBody>
                    <Link to={paths.sourcesNew}>
                        <Button style={{ marginTop: 'var(--pf-c-empty-state--c-button--MarginTop)' }}
                            variant="primary">
                            <FormattedMessage
                                id="sources.emptyStateButton"
                                defaultMessage="Add a source"
                            />
                        </Button>
                    </Link>
                </EmptyState>
            </Bullseye>
        </CardBody>
    </Card>
);

export default SourcesEmptyState;
