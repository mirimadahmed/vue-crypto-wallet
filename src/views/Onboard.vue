<template>
  <div class="onboard px-5">
    <div class="px-5 w-50 m-auto">
      <b-form-group
            id="input-group-1"
            label="2FA Setup:"
            label-for="input-1"
            description="Enter 2FA Code."
          >
            <b-form-input
              id="input-1"
              type="text"
              placeholder="2FA Code"
              required
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Next</b-button>
    </div>
  </div>
</template>
