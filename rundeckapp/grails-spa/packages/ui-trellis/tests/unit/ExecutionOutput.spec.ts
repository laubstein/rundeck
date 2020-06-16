import 'isomorphic-fetch'

console.log(global.fetch)

import {ExecutionOutput, ExecutionOutputStore} from '../../src/stores/ExecutionOutput'
import {ExecutionLog} from '../../src/utilities/ExecutionLogConsumer'

import {observe, autorun, intercept} from 'mobx'
import { PasswordCredentialProvider, passwordAuthPolicy, rundeckPasswordAuth, RundeckClient, TokenCredentialProvider } from 'ts-rundeck'
import {RundeckVcr, Cassette} from 'ts-rundeck/dist/util/RundeckVcr'
import { BtoA, AtoB } from '../utilities/Base64'
import { RootStore } from '../../src/stores/RootStore'
import fetchMock from 'fetch-mock'

jest.setTimeout(60000)

describe('ExecutionOutput Store', () => {
    it('Loads Output', async () => {
        const client = new RundeckClient(new TokenCredentialProvider('foo'), {baseUri: '/'})

        const vcr = new RundeckVcr
        const cassette = await Cassette.Load('./tests/data/fixtures/ExecRunningOutput.json')
        vcr.play(cassette, fetchMock)

        const rootStore = new RootStore(client)

        const {executionOutputStore} = rootStore

        const output = executionOutputStore.createOrGet('900')

        const intercepter = observe(output.entries, change => {
            console.log(change.type == 'splice')
            if (change.type == 'splice') {
                console.log(change.index)
                console.log(change.addedCount)
            }
        })

        let finished = false
        while (!finished) {
            const output = await executionOutputStore.getOutput('900', 200)
            finished = output.completed
        }

        // console.log(executionOutputStore.executionOutputsById.get('900')?.entries)

    })
    // it('Saves', async () => {
        // jest.setTimeout(60000)
        // const client = rundeckPasswordAuth('admin', 'admin', {baseUri: 'http://xubuntu:4440'})

        // const vcr = new RundeckVcr()

        // // const run = await client.jobExecutionRun('825b3ed7-3d40-418f-bfb4-313ff4d50577')

        // const cassette = new Cassette([/execution/, /job/], './tests/data/fixtures/ExecAnsiColorOutput.json')

        // vcr.record(cassette)
    
        // const consumer = new ExecutionLog('912', client)

        // await consumer.init()

        // await consumer.getJobWorkflow()

        // let finished: boolean = false
        // while (!finished) {
        //     let resp = await consumer.getOutput(200)
        //     finished = consumer.completed
        // }

        // await cassette.store()

    // })
})