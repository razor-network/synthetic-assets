<template>
<div>
  <div class="row row-space-12 pt-50 mt-50">
    <div class="col-xl-12 ">
      <!-- <div class="row"> -->

      <h3>Frequently Asked Questions</h3>
      <h4> What are Razor Synths? </h4>
      <p>Razor Synths are synthetic ERC20 tokens which can track any asset in the world.</p>

      <h4> Who is this app for? </h4>
      <p>This app is primarily for those who want to open short positions on assets. Those who want to open a long position should buy the tokens from shorters.
      </p>
      <h4> How does it work? </h4>
      <p>Those who want to open a short position create a CDP (Collateralized Debt Postion) against the datafeed of their choice. They then collateralize the position using Ether and borrow the desired synthetic asset. They must pay back the debt in order to get their
        collateral back.
      </p>
      <h4> Where does the data come from? Which oracle is used?</h4>
      <p>The data is fetched using <a target="_blank" href="https://razor.network"> Razor Network</a>, a decentralized oracle network.
      </p>



      <h4> How to open a short position?</h4>
      <p> Creating a CDP using this app backed by Ether will mint the synthetic tokens. You can sell those ERC20 tokens to anyone to open a "short" position. In the "Mint" form, enter the amount of ether you want to collateralize with and click
        "Mint". A new CDP will be opened with 500% Collateral ratio. </p>

      <h4> How to open a long position? </h4>
      <p> Buy the synthetic ERC20 tokens from anyone to open a long position. You can sell them later to close your position. </p>

      <h4> What is the minimum collateral ratio? </h4>
      <p>Minimum collateral ratio is 200%, below which the CDP may be liquidated. </p>

      <h4> Is there any interest charged? </h4>
      <p>There is currently no interest charged for CDPs.
      </p>

      <h4> Can I add a new asset?  </h4>
      <p>You can add an asset in Razor network from <a class="font-weight-bold" target="_blank" href='https://razorscan.io/#/query'>RazorScan</a>. You will then be able to mint a synthetic asset based on that datafeed using Razor Synth.
      </p>


      <!-- <div class="col-md-4 overlay-disabled">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-4">Liquidate</h4>

            <button class="btn btn-block btn-primary" @click="liquidate">Liquidate</button>
          </div>
        </div>
      </div> -->

    </div>
  </div>
</div>
</template>

<style lang="scss">
.short {
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.overlay-disabled {
    opacity: 0.5;
}

.hi {
    text-overflow: ellipsis;
    overflow: hidden;

}

.singleLine {
    word-break: break-all;
    white-space: nowrap;
}

.none {
    display: none;
}
.invisible {
    display: hidden;
}
a {
    text-decoration: underline;
    color: grey;
}
.red {
    color: red;
}
.whiteBg {
    background: white;
}
</style>
