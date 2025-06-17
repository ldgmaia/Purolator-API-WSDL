const soap = require('soap')

// 🔐 Your Purolator Dev credentials
const DEV_KEY = '1133cc20897f485a9a2a5d5bb1d38e5c'
const DEV_PASS = '^tY?Dmkg'

// 🔍 A valid test tracking PIN (Purolator sandbox value)
const TRACKING_PIN = 'M123'

// 📄 WSDL URL (SOAP contract)
const WSDL_URL = require('path').resolve(__dirname, 'tracking.wsdl')

// 🔗 Endpoint URL (must match the WSDL's service location)
const SERVICE_URL =
  'https://devwebservices.purolator.com/PWS/V1/Tracking/TrackingService.asmx'

async function trackPackage() {
  try {
    const client = await soap.createClientAsync(WSDL_URL, {
      endpoint: SERVICE_URL,
    })

    // 🔐 Set Basic Auth for your dev credentials
    client.setSecurity(new soap.BasicAuthSecurity(DEV_KEY, DEV_PASS))

    // 🧾 Set the SOAP Header (RequestContext) — required by Purolator
    const soapHeader = {
      RequestContext: {
        Version: '1.2',
        Language: 'en',
        GroupID: 'MyGroup', // arbitrary ID
        RequestReference: 'NodeJS Test',
      },
    }
    client.addSoapHeader(
      soapHeader,
      '',
      'ns1',
      'http://purolator.com/pws/datatypes/v1'
    )

    // 📦 Define the PIN(s) you want to track
    const args = {
      PINs: {
        PIN: {
          Value: TRACKING_PIN,
        },
      },
    }

    // 🚀 Make the request
    const [result] = await client.TrackPackagesByPinAsync(args)

    console.log('✅ Tracking Result:\n', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ Error occurred:', error.message || error)
  }
}

trackPackage()
