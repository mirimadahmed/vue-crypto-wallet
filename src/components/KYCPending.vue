<template>
  <div class="col-md-6 m-auto bg-light text-center">
    <div class="row p-4 login-wrapper m-0">
      <div class="col-12 m-0">
        <h3 class="p-2 mt-3">{{ $t("auth.kyc.pending_heading") }}</h3>
      </div>
      <div class="col-12 m-0">
        <p>{{ $t("auth.kyc.pending_lead") }}</p>
      </div>
      <div class="col-12 m-0">
        <p>
          <img
            src="../assets/illustration-security.png"
            alt="graph-3"
            class="w-50"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
@media (max-width: 768px) {
  .login-wrapper {
    width: 100%;
    padding: 0 !important;
  }
  .auth-boxes {
    width: 100%;
    padding: 10px !important;
  }
}

@media (min-width: 769px) {
  .auth-boxes {
    width: 60%;
  }
}
</style>