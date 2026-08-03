"use client";
import { gql } from '@apollo/client'
import { QueryHookOptions, useQuery } from '@apollo/client/react'

// Possible subscription status values (extend as needed)


export type SubscriptionModule = {
	icon?: string | null
	isPopular?: boolean | null
	name?: string | null
	showInMobileNavigation?: boolean | null
	showInMobileNavigationSortNumber
		?: number | null
}

export type CheckSubscriptionData = {
	checkSubscription: {
		modules?: SubscriptionModule[] | null
		status?: Boolean
	}
}

export const CHECK_SUBSCRIPTION = gql`
	query Modules {
		checkSubscription {
			modules {
				icon
				isPopular
				name
				showInMobileNavigation
				showInMobileNavigationSortNumber
			}
			status
		}
	}
`

export const useCheckSubscription = (
	options?: QueryHookOptions<CheckSubscriptionData, Record<string, never>>,
) => {
	return useQuery<CheckSubscriptionData, Record<string, never>>(CHECK_SUBSCRIPTION, options)
}

/*
Example usage:

const { data, loading, error, refetch } = useCheckSubscription()
const modules = data?.checkSubscription?.modules || []
const status = data?.checkSubscription?.status

if (status === 'ACTIVE') { /* ... */ 



