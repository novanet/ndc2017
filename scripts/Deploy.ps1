param (
    [string]$ResourceGroupName = $(Read-Host "Enter Resource group name (Press Enter for 'NDC2017')")
)

if([string]::IsNullOrEmpty($ResourceGroupName)) { $ResourceGroupName = "NDC2017"; }
Write-Host "Resource group: "$ResourceGroupName;

Try {
  Get-AzureRmContext
} Catch {
  if ($_ -like "*Login-AzureRmAccount to login*") {
    Login-AzureRmAccount
  }
}
Set-AzureRmContext -SubscriptionId 64aa2c64-0643-46e6-b55f-3e37a345f405;

New-AzureRmResourceGroup -Name $ResourceGroupName -Location "West Europe"
New-AzureRmResourceGroupDeployment -Name Ndc2017Deployment -ResourceGroupName $ResourceGroupName -TemplateFile azuredeploy.json -TemplateParameterFile parameters.json;
