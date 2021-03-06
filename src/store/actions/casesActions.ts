import {
    CASES_DETAIL_SLIM_QUERY,
    CREATE_CASE_MUTATION,
    addCaseCache,
} from './fragments/cases';
import { GraphQLError } from 'graphql';
import {
    casesDetailSlim,
    casesDetailSlim_cases,
} from '../../generated/casesDetailSlim';
import { CreateCaseInput } from '../../generated/globalTypes';
import {
    createCaseMutation,
    createCaseMutationVariables,
} from '../../generated/createCaseMutation';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ThunkResult } from '../store';

export enum CasesTypes {
    GET_USER_CASES_START = 'GET_USER_CASES_START',
    GET_USER_CASES_SUCCESS = 'GET_USER_CASES_SUCCESS',
    GET_USER_CASES_FAILURE = 'GET_USER_CASES_FAILURE',
    CLEAR_USER_CASES = 'CLEAR_USER_CASES',
    CREATE_CASE = 'CREATE_CASE',
    CREATE_CASE_SUCCESS = 'CREATE_CASE_SUCCESS',
    CREATE_CASE_FAILURE = 'CREATE_CASE_FAILURE',
    CLEAR_CASE_SUCCESS = 'CLEAR_CASE_SUCCESS',
    CLEAR_ADD_CASE_ERROR = 'CLEAR_ADD_CASE_ERROR',
}

export interface CasesStartAction {
    type: CasesTypes.GET_USER_CASES_START;
}

export interface CasesSuccessAction {
    type: CasesTypes.GET_USER_CASES_SUCCESS;
    cases: casesDetailSlim_cases[];
}

export interface CasesFailureAction {
    type: CasesTypes.GET_USER_CASES_FAILURE;
    error: string;
}

export interface CasesClearAction {
    type: CasesTypes.CLEAR_USER_CASES;
}

export type CasesActionTypes =
    | CasesStartAction
    | CasesSuccessAction
    | CasesFailureAction
    | CasesClearAction
    | CreateCaseAction
    | CreateCaseSuccessAction
    | CreateCaseFailureAction
    | ClearCaseSuccessAction
    | AddCaseClearErrorAction;

export interface CasesDispatch {
    (arg0: CasesActionTypes): void;
}

export interface CreateCaseAction {
    type: CasesTypes.CREATE_CASE;
}

export interface CreateCaseSuccessAction {
    type: CasesTypes.CREATE_CASE_SUCCESS;
    case: casesDetailSlim_cases;
}

export interface ClearCaseSuccessAction {
    type: CasesTypes.CLEAR_CASE_SUCCESS;
}

export interface AddCaseClearErrorAction {
    type: CasesTypes.CLEAR_ADD_CASE_ERROR;
}

export interface CreateCaseFailureAction {
    type: CasesTypes.CREATE_CASE_FAILURE;
    error: string;
}

// this action grabs all cases for a specified user
export const getCases = (): ThunkResult<void> => (
    dispatch: CasesDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
) => {
    dispatch({ type: CasesTypes.GET_USER_CASES_START });
    console.log('Loading cases...');

    client
        .watchQuery<casesDetailSlim>({ query: CASES_DETAIL_SLIM_QUERY })
        .subscribe(
            (result) => {
                console.log(`Loading cases: success`);
                dispatch({
                    type: CasesTypes.GET_USER_CASES_SUCCESS,
                    cases: result.data.cases,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading cases: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: CasesTypes.GET_USER_CASES_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const addCaseClearError = () => (dispatch: CasesDispatch): void => {
    //resets document error to undefined
    dispatch({
        type: CasesTypes.CLEAR_ADD_CASE_ERROR,
    });
};

export const createCase = (value: CreateCaseInput): ThunkResult<void> => (
    dispatch: CasesDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
    dispatch({ type: CasesTypes.CREATE_CASE });
    console.log(`Creating case...`);

    client
        .mutate<createCaseMutation, createCaseMutationVariables>({
            mutation: CREATE_CASE_MUTATION,
            variables: { value },
            update: (cache, result) => {
                if (result.data) {
                    addCaseCache(result.data.createCase, cache);
                }
            },
        })
        .then(
            (result) => {
                if (result.data) {
                    console.log(`Creating case: success`);
                    dispatch({
                        type: CasesTypes.CREATE_CASE_SUCCESS,
                        case: result.data.createCase,
                    });
                } else {
                    console.log(`Creating case: error: returned no data`);

                    dispatch({
                        type: CasesTypes.CREATE_CASE_FAILURE,
                        error: `returned no data`,
                    });
                }
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating case: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: CasesTypes.CREATE_CASE_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearAddCaseSuccess = () => (dispatch: CasesDispatch): void => {
    //new document back to false
    dispatch({
        type: CasesTypes.CLEAR_CASE_SUCCESS,
    });
};

export const clearUserCases = (): ThunkResult<void> => (
    dispatch: CasesDispatch
): void => {
    dispatch({ type: CasesTypes.CLEAR_USER_CASES });
    // TODO actually clear data
};
