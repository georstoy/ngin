#!/usr/bin/env node
import 'source-map-support/register';
import {App as CDK_App} from '@aws-cdk/core';
import { Ngin } from '../lib/ngin';

const app = new CDK_App();
new Ngin(app, 'Engine');
