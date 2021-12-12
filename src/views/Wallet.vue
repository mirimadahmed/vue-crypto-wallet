<template>
  <div class="wallet">
    <h3>Welcome Imad!</h3>
    <p>You have $123 in total.</p>
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Assets" active>
        <b-table hover :items="assets"></b-table>
      </b-tab>
      <b-tab title="Transactions">
        <b-table hover :items="transactions"></b-table>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        assets: [
          { asset: 'SXRDX', value: 40,  },
          { asset: 'WBTC.e', value: 2,  },
          { asset: 'WETH.e', value: 10,  },
          { asset: 'USDC.e', value: 38,  }
        ],
        transactions: [
          { type: 'Sent', asset: 'SXRDX', amount: 40,  },
          { type: 'Received', asset: 'SXRDX', amount: 2,  },
          { type: 'Sent', asset: 'SXRDX', amount: 10,  },
          { type: 'Received', asset: 'SXRDX', amount: 38,  }
        ]
      }
    }
  }
</script>