import * as api from '../../api/entities';
import { doUpdateSource, parseUrl, urlOrHost } from '../../api/doUpdateSource';

describe('doUpdateSource', () => {
  const HOST = 'mycluster.net';
  const PATH = '/path';
  const PORT = '1234';
  const SCHEME = 'https';

  const URL = `${SCHEME}://${HOST}:${PORT}${PATH}`;

  const EXPECTED_URL_OBJECT = {
    host: HOST,
    path: PATH,
    port: PORT,
    scheme: SCHEME,
  };

  const SOURCE_ID = '1232312';
  const ENDPOINT_ID = '1323232';
  const SOURCE = {
    source: {
      id: SOURCE_ID,
    },
    endpoints: [
      {
        id: ENDPOINT_ID,
      },
    ],
  };

  let FORM_DATA;

  let sourceSpy;
  let endpointSpy;
  let authenticationSpy;
  let applicationSpy;
  let patchCostManagementSpy;

  beforeEach(() => {
    sourceSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    endpointSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    authenticationSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    applicationSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    patchCostManagementSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    api.getSourcesApi = () => ({
      updateSource: sourceSpy,
      updateEndpoint: endpointSpy,
      updateAuthentication: authenticationSpy,
      updateApplication: applicationSpy,
    });
  });

  it('sends nothing', () => {
    FORM_DATA = {};

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).not.toHaveBeenCalled();
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends source values', () => {
    const SOURCE_VALUES = { name: 'pepa' };

    FORM_DATA = {
      source: SOURCE_VALUES,
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).toHaveBeenCalledWith(SOURCE_ID, SOURCE_VALUES);
    expect(endpointSpy).not.toHaveBeenCalled();
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends endpoint values', () => {
    const ENDPOINT_VALUES = { tenant: 'US-EAST' };

    FORM_DATA = {
      endpoint: ENDPOINT_VALUES,
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, ENDPOINT_VALUES);
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends endpoint values with URL', () => {
    const ENDPOINT_VALUES = { tenant: 'US-EAST' };

    FORM_DATA = {
      url: URL,
      endpoint: ENDPOINT_VALUES,
    };

    const EXPECTED_ENDPOINT_VALUES_WITH_URL = {
      ...ENDPOINT_VALUES,
      ...EXPECTED_URL_OBJECT,
      port: Number(PORT),
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, EXPECTED_ENDPOINT_VALUES_WITH_URL);
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends endpoint values only with URL', () => {
    FORM_DATA = {
      url: URL,
    };

    const EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL = {
      ...EXPECTED_URL_OBJECT,
      port: Number(PORT),
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL);
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends endpoint values removed url', () => {
    FORM_DATA = {
      url: null,
    };

    const EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL = {
      scheme: null,
      host: null,
      port: null,
      path: null,
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL);
    expect(authenticationSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends authentication values', () => {
    const AUTH_ID = '1234234243';
    const AUTHENTICATION_VALUES = { password: '123456' };

    FORM_DATA = {
      authentications: { [`a${AUTH_ID}`]: AUTHENTICATION_VALUES },
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).not.toHaveBeenCalled();
    expect(authenticationSpy).toHaveBeenCalledWith(AUTH_ID, AUTHENTICATION_VALUES);
    expect(applicationSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
  });

  it('sends multiple authentication values', () => {
    const AUTH_ID = '1234234243';
    const AUTH_ID_2 = '7232490239';
    const AUTHENTICATION_VALUES = { password: '123456' };
    const AUTHENTICATION_VALUES_2 = { usernamen: 'QWERTY' };

    FORM_DATA = {
      authentications: {
        [`a${AUTH_ID}`]: AUTHENTICATION_VALUES,
        [`a${AUTH_ID_2}`]: AUTHENTICATION_VALUES_2,
      },
    };

    doUpdateSource(SOURCE, FORM_DATA);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
    expect(applicationSpy).not.toHaveBeenCalled();

    expect(authenticationSpy.mock.calls.length).toEqual(Object.keys(FORM_DATA.authentications).length);

    expect(authenticationSpy.mock.calls[0][0]).toBe(AUTH_ID);
    expect(authenticationSpy.mock.calls[0][1]).toBe(AUTHENTICATION_VALUES);

    expect(authenticationSpy.mock.calls[1][0]).toBe(AUTH_ID_2);
    expect(authenticationSpy.mock.calls[1][1]).toBe(AUTHENTICATION_VALUES_2);
  });

  it('sends multiple application values', () => {
    const APP_ID = '1234234243';
    const APP_ID_2 = '7232490239';
    const APP_ID_3 = '32386783';

    const APPLICATION_VALUES = { extra: { password: '123456' } };
    const APPLICATION_VALUES_2 = { extra: { username: 'QWERTY' } };

    FORM_DATA = {
      applications: {
        [`a${APP_ID}`]: APPLICATION_VALUES,
        [`a${APP_ID_2}`]: APPLICATION_VALUES_2,
      },
    };

    const VALUES = {
      applications: {
        [`a${APP_ID}`]: { extra: { original: 1, password: '123456' } },
        [`a${APP_ID_2}`]: APPLICATION_VALUES_2,
        [`a${APP_ID_3}`]: { extra: { dataset: 'dataset-123' } },
      },
    };

    doUpdateSource(SOURCE, FORM_DATA, VALUES);

    expect(sourceSpy).not.toHaveBeenCalled();
    expect(endpointSpy).not.toHaveBeenCalled();
    expect(patchCostManagementSpy).not.toHaveBeenCalled();
    expect(authenticationSpy).not.toHaveBeenCalled();

    expect(applicationSpy.mock.calls.length).toEqual(Object.keys(FORM_DATA.applications).length);

    expect(applicationSpy.mock.calls[0][0]).toEqual(APP_ID);
    expect(applicationSpy.mock.calls[0][1]).toEqual({ extra: { original: 1, password: '123456' } });

    expect(applicationSpy.mock.calls[1][0]).toEqual(APP_ID_2);
    expect(applicationSpy.mock.calls[1][1]).toEqual(APPLICATION_VALUES_2);
  });

  describe('failures', () => {
    const ERROR_TEXT = 'some error text';
    const ERROR_OBJECT = {
      errors: [
        {
          detail: ERROR_TEXT,
        },
      ],
    };

    it('handle source failure', async () => {
      sourceSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR_OBJECT));

      const EXPECTED_ERROR = {
        errors: [
          {
            detail: ERROR_TEXT,
          },
        ],
      };

      const SOURCE_VALUES = { name: 'pepa' };

      FORM_DATA = {
        source: SOURCE_VALUES,
      };

      try {
        await doUpdateSource(SOURCE, FORM_DATA);
        throw 'should not be here';
      } catch (error) {
        expect(error).toEqual(EXPECTED_ERROR);
      }
    });
  });

  describe('helpers', () => {
    const EMPTY_OBJECT = {};

    describe('parseUrl', () => {
      it('parses URL', () => {
        expect(parseUrl(URL)).toEqual(EXPECTED_URL_OBJECT);
      });

      it('parses URL with empty port', () => {
        const URL_EMPTY_PORT = `${SCHEME}://${HOST}${PATH}`;

        const EXPECTED_URL_OBJECT_EMPTY_PORT = {
          ...EXPECTED_URL_OBJECT,
          port: '443',
        };

        expect(parseUrl(URL_EMPTY_PORT)).toEqual(EXPECTED_URL_OBJECT_EMPTY_PORT);
      });

      it('parses undefined', () => {
        expect(parseUrl(undefined)).toEqual(EMPTY_OBJECT);
      });

      it('throw empty object on error', () => {
        const WRONG_URL = `://${HOST}${SCHEME}:${PORT}${PATH}`;

        expect(parseUrl(WRONG_URL)).toEqual(EMPTY_OBJECT);
      });

      it('parses null (removed)', () => {
        expect(parseUrl(null)).toEqual({
          scheme: null,
          host: null,
          port: null,
          path: null,
        });
      });
    });

    describe('urlOrHost', () => {
      it('returns form data', () => {
        const FORM_DATA_WITHOUT_URL = {
          port: '1234',
          scheme: 'https',
        };

        expect(urlOrHost(FORM_DATA_WITHOUT_URL)).toEqual(FORM_DATA_WITHOUT_URL);
      });

      it('returns parsed url', () => {
        expect(urlOrHost({ url: URL })).toEqual(EXPECTED_URL_OBJECT);
      });

      it('returns remove url', () => {
        expect(urlOrHost({ url: null })).toEqual({
          scheme: null,
          host: null,
          port: null,
          path: null,
        });
      });
    });
  });
});
