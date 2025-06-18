const soap = require('soap')

// 🔐 Your Purolator Dev credentials
const KEY = process.env.API_KEY
const PASSWORD = process.env.API_PASSWORD

// 🔍 A valid test tracking PIN (Purolator sandbox value)
const TRACKING_PIN = '335503145286'

// 📄 WSDL URL (SOAP contract)
const WSDL_URL = require('path').resolve(__dirname, 'TrackingService.wsdl')

// 🔗 Endpoint URL (must match the WSDL's service location)
const SERVICE_URL =
  'https://webservices.purolator.com/PWS/V1/Tracking/TrackingService.asmx'

async function trackPackage() {
  try {
    const client = await soap.createClientAsync(WSDL_URL, {
      endpoint: SERVICE_URL,
    })

    // 🔐 Set Basic Auth for your dev credentials
    client.setSecurity(new soap.BasicAuthSecurity(KEY, PASSWORD))

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
    console.log(
      result.TrackingInformationList.TrackingInformation.at(0).Scans.Scan.at(0)
        .Description
    )
  } catch (error) {
    console.error('❌ Error occurred:', error.message || error)
  }
}

trackPackage()
