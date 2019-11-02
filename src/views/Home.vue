<template>
<div>

    <div class="row row-space-12">
      <div class="col-xl-6 col-lg-6 mb-4">
        <!-- <div class="row"> -->
        <h3> Welcome to Razor Synths</h3>

        <p class='lead'> Using this dapp you can "mint" tokens which tracks any asset in the world.</p>
        <p> It uses <a class="font-weight-bold" target="_blank" href="https://razor.network"> Razor Decentralised Oracle Network</a> to get the data.</p>
        <p><strong> Note: This is a demo application deployed on Görli testnet. Please don't send valuable assets!</strong></p>

        <h3> How to open a short position?</h3>
        <p> Creating a CDP using this app backed by Ether will mint the synthetic tokens. You can sell these ERC20 tokens to anyone to open a "short" position. </p>

        <h3> How to open a long position? </h3>
        <p> Buy the synthetic ERC20 tokens from anyone to open a long position. </p>

      </div>
      <div class="col-md-6">
        <div class="p-6">
          <img src="@/assets/img/hello.svg" class="img-fluid">
          <!-- <div class="footer"> (c) 2019 All rights reserved </div> -->
        </div>
      </div>
      <router-link to="/App" class="btn btn-primary text-decoration-none">

                        <span>Let's get started</span>
                    </router-link>

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
